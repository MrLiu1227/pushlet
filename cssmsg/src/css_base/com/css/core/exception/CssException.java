package com.css.core.exception;

/**
 * CssException类
 * 
 * @author CSS. WeidongWang
 * @since 2018-6-20
 * @version 1.0
 */

public class CssException extends RuntimeException {
	private static final long serialVersionUID = 1L;

	/**
	 * Constructs a <code>CssException</code> with no detail message.
	 */
	public CssException() {
	}

	/**
	 * Constructs a <code>CssException</code> with the specified detail message.
	 *
	 * @param s
	 *           the detail message.
	 */
	public CssException(String s) {
		this(s, null, null);
	}

	/**
	 * Constructs a <code>CssException</code> with the specified detail message
	 * and target.
	 *
	 * @param s
	 *           the detail message.
	 * @param target
	 *           the target of the exception.
	 */
	public CssException(String s, Object target) {
		this(s, (Throwable) null, target);
	}

	/**
	 * Constructs a <code>CssException</code> with the root cause
	 *
	 * @param cause
	 *           The wrapped exception
	 */
	public CssException(Throwable cause) {
		this(null, cause, null);
	}

	/**
	 * Constructs a <code>CssException</code> with the root cause and target
	 *
	 * @param cause
	 *           The wrapped exception
	 * @param target
	 *           The target of the exception
	 */
	public CssException(Throwable cause, Object target) {
		this(null, cause, target);
	}

	/**
	 * Constructs a <code>CssException</code> with the specified detail message
	 * and exception cause.
	 *
	 * @param s
	 *           the detail message.
	 * @param cause
	 *           the wrapped exception
	 */
	public CssException(String s, Throwable cause) {
		this(s, cause, null);
	}

	/**
	 * Constructs a <code>CssException</code> with the specified detail message,
	 * cause, and target
	 *
	 * @param s
	 *           the detail message.
	 * @param cause
	 *           The wrapped exception
	 * @param target
	 *           The target of the exception
	 */
	public CssException(String s, Throwable cause, Object target) {
		super(s, cause);
	}

	/**
	 * Returns a short description of this throwable object, including the
	 * location. If no detailed message is available, it will use the message of
	 * the underlying exception if available.
	 *
	 * @return a string representation of this <code>Throwable</code>.
	 */
	@Override
	public String toString() {
		String msg = getMessage();
		return msg;
	}
}
